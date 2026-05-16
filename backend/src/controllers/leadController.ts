import { Request, Response, NextFunction } from 'express';
import Lead, { LeadStatus, LeadSource } from '../models/Lead';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomError } from '../utils/CustomError';
import { z } from 'zod';
import { format } from '@fast-csv/format';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource),
});

const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
});

// @desc    Get all leads with pagination, filtering, and search
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.source) {
    filter.source = req.query.source;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ];
  }

  // Sorting
  let sortQuery: any = { createdAt: -1 }; // default latest
  if (req.query.sort === 'Oldest') {
    sortQuery = { createdAt: 1 };
  }

  const leads = await Lead.find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  const total = await Lead.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    data: {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new CustomError('Lead not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      lead,
    },
  });
});

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedBody = createLeadSchema.parse(req.body);

  const lead = await Lead.create(parsedBody);

  res.status(201).json({
    status: 'success',
    data: {
      lead,
    },
  });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedBody = updateLeadSchema.parse(req.body);

  const lead = await Lead.findByIdAndUpdate(req.params.id, parsedBody, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    return next(new CustomError('Lead not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      lead,
    },
  });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return next(new CustomError('Lead not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private (Admin only)
export const exportLeadsCSV = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // We can apply the same filters if needed, but for simplicity we export all based on current filter or just all.
  const filter: any = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.source) filter.source = req.query.source;
  
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');

  const csvStream = format({ headers: true });
  csvStream.pipe(res);

  leads.forEach((lead) => {
    csvStream.write({
      ID: lead._id,
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      CreatedAt: lead.createdAt?.toISOString(),
    });
  });

  csvStream.end();
});
