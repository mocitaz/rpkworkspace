export type AppPermission =
    // Matters
    | 'matter.view'
    | 'matter.view.all'
    | 'matter.create'
    | 'matter.update'
    | 'matter.archive'
    // Clients & Contacts
    | 'client.view'
    | 'client.manage'
    | 'contact.view'
    | 'contact.manage'
    // Tasks
    | 'task.view'
    | 'task.create'
    | 'task.manage'
    // Documents & Signatures
    | 'document.view'
    | 'document.upload'
    | 'document.download'
    | 'document.delete'
    | 'document.approve'
    | 'signature.view'
    | 'signature.manage'
    // Finance & Billing
    | 'billing.view'
    | 'billing.manage'
    | 'expense.view'
    | 'expense.manage'
    | 'payment.view'
    | 'payment.manage'
    | 'quotation.view'
    | 'quotation.manage'
    | 'quotation.approve'
    // Governance, Conflict & Archives
    | 'correspondence.view'
    | 'correspondence.manage'
    | 'conflict.view'
    | 'conflict.manage'
    | 'conflict.approve'
    | 'archive.view'
    | 'archive.manage'
    | 'archive.legal_hold.manage'
    // Admin & Security
    | 'audit.view'
    | 'admin.users.manage';
