# Modular Prisma Models

This directory contains the Prisma schema split into modular model files for maintainability.

## Model Files

- `user.prisma` — User, Caregiver, TrustedContact
- `fax.prisma` — FaxRequest, RequestStatus
- `audit.prisma` — AuditLog
- `ai.prisma` — AiProcessingLog
- `queue.prisma` — QueueJob, JobStatus
- `rbac.prisma` — UserRole, Role
- `medical.prisma` — MedicalRecord
- `transaction.prisma` — TransactionRecord, TransactionType, TransactionStatus
- `sponsor.prisma` — SponsorPayment, PaymentFrequency, SponsorPaymentStatus
- `approval.prisma` — ApprovalWorkflow, ApprovalStatus

## Usage

These modular files can be combined using `prisma merge` or a build tool.
The main `schema.prisma` in the parent directory contains the full unified schema.
