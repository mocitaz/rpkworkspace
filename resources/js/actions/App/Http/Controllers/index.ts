import SignatureVerificationController from './SignatureVerificationController'
import SignatureSigningController from './SignatureSigningController'
import CalendarController from './CalendarController'
import InboundEmailController from './InboundEmailController'
import DashboardController from './DashboardController'
import GuideController from './GuideController'
import MatterController from './MatterController'
import MatterOperationController from './MatterOperationController'
import MatterEventChecklistController from './MatterEventChecklistController'
import MatterChronologyController from './MatterChronologyController'
import MatterReportController from './MatterReportController'
import ClientController from './ClientController'
import ContactController from './ContactController'
import TaskController from './TaskController'
import CommentController from './CommentController'
import FinanceController from './FinanceController'
import FinanceDetailController from './FinanceDetailController'
import GovernanceController from './GovernanceController'
import DocumentController from './DocumentController'
import DocumentApprovalController from './DocumentApprovalController'
import SignatureRequestController from './SignatureRequestController'
import SignatureReminderController from './SignatureReminderController'
import SignatureArtifactController from './SignatureArtifactController'
import DocumentVersionController from './DocumentVersionController'
import DocumentPreviewController from './DocumentPreviewController'
import SearchController from './SearchController'
import DirectMessageController from './DirectMessageController'
import NotificationController from './NotificationController'
import AuditLogController from './AuditLogController'
import SystemReadinessController from './SystemReadinessController'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    SignatureVerificationController: Object.assign(SignatureVerificationController, SignatureVerificationController),
    SignatureSigningController: Object.assign(SignatureSigningController, SignatureSigningController),
    CalendarController: Object.assign(CalendarController, CalendarController),
    InboundEmailController: Object.assign(InboundEmailController, InboundEmailController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    GuideController: Object.assign(GuideController, GuideController),
    MatterController: Object.assign(MatterController, MatterController),
    MatterOperationController: Object.assign(MatterOperationController, MatterOperationController),
    MatterEventChecklistController: Object.assign(MatterEventChecklistController, MatterEventChecklistController),
    MatterChronologyController: Object.assign(MatterChronologyController, MatterChronologyController),
    MatterReportController: Object.assign(MatterReportController, MatterReportController),
    ClientController: Object.assign(ClientController, ClientController),
    ContactController: Object.assign(ContactController, ContactController),
    TaskController: Object.assign(TaskController, TaskController),
    CommentController: Object.assign(CommentController, CommentController),
    FinanceController: Object.assign(FinanceController, FinanceController),
    FinanceDetailController: Object.assign(FinanceDetailController, FinanceDetailController),
    GovernanceController: Object.assign(GovernanceController, GovernanceController),
    DocumentController: Object.assign(DocumentController, DocumentController),
    DocumentApprovalController: Object.assign(DocumentApprovalController, DocumentApprovalController),
    SignatureRequestController: Object.assign(SignatureRequestController, SignatureRequestController),
    SignatureReminderController: Object.assign(SignatureReminderController, SignatureReminderController),
    SignatureArtifactController: Object.assign(SignatureArtifactController, SignatureArtifactController),
    DocumentVersionController: Object.assign(DocumentVersionController, DocumentVersionController),
    DocumentPreviewController: Object.assign(DocumentPreviewController, DocumentPreviewController),
    SearchController: Object.assign(SearchController, SearchController),
    DirectMessageController: Object.assign(DirectMessageController, DirectMessageController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    AuditLogController: Object.assign(AuditLogController, AuditLogController),
    SystemReadinessController: Object.assign(SystemReadinessController, SystemReadinessController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers