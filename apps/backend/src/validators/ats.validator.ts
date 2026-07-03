import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters long.'),
});

export const fileUploadSchema = z.object({
  mimetype: z.enum([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ], {
    errorMap: () => ({ message: 'Only PDF, DOCX, and TXT files are allowed' })
  }),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
});
