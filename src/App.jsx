import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WebSocketProvider } from './context/WebSocketProvider'
import { NotificationProvider } from './context/NotificationProvider'
import ProtectedRoute from './components/common/ProtectedRoute'
import GuestRoute from './components/common/GuestRoute'
import RoleGuard from './components/common/RoleGuard'
import RoleBasedLayout from './components/layout/RoleBasedLayout'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import HomePage from './pages/feed/HomePage'
import PostDetailPage from './pages/post/PostDetailPage'
import ProfilePage from './pages/profile/ProfilePage'
import FriendsPage from './pages/friend/FriendsPage'
import BlockedUsersPage from './pages/settings/BlockedUsersPage'
import SearchPage from './pages/search/SearchPage'
import GroupsDiscoverPage from './pages/group/GroupsDiscoverPage'
import MyGroupsPage from './pages/group/MyGroupsPage'
import GroupDetailPage from './pages/group/GroupDetailPage'
import CreateGroupPage from './pages/group/CreateGroupPage'
import TeacherApplyPage from './pages/teacher/TeacherApplyPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminPostsPage from './pages/admin/AdminPostsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminTeachersPage from './pages/admin/AdminTeachersPage'
import AdminQuizPendingPage from './pages/admin/AdminQuizPendingPage'
import ChatPage from './pages/chat/ChatPage'
import QuizListPage from './pages/quiz/QuizListPage'
import QuizTakePage from './pages/quiz/QuizTakePage'
import QuizAttemptsPage from './pages/quiz/QuizAttemptsPage'
import QuizAttemptDetailPage from './pages/quiz/QuizAttemptDetailPage'
import TeacherQuizListPage from './pages/quiz/TeacherQuizListPage'
import CreateQuizPage from './pages/quiz/CreateQuizPage'
import TeacherQuizSubmissionsPage from './pages/quiz/TeacherQuizSubmissionsPage'
import TeacherSubmissionDetailPage from './pages/quiz/TeacherSubmissionDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WebSocketProvider>
          <NotificationProvider>
            <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/verify" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedLayout />}>
              <Route index element={<HomePage />} />
              <Route path="post/:id" element={<PostDetailPage />} />
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="settings/blocked" element={<BlockedUsersPage />} />
              <Route path="quizzes" element={<QuizListPage />} />
              <Route element={<RoleGuard roles={['STUDENT']} />}>
                <Route path="quizzes/:id/take" element={<QuizTakePage />} />
                <Route path="quizzes/:id/attempts" element={<QuizAttemptsPage />} />
                <Route path="quizzes/:id/attempts/:attemptId" element={<QuizAttemptDetailPage />} />
              </Route>
              <Route path="groups" element={<GroupsDiscoverPage />} />
              <Route path="groups/my" element={<MyGroupsPage />} />
              <Route path="groups/:id" element={<GroupDetailPage />} />
              <Route path="teacher/apply" element={<TeacherApplyPage />} />
              <Route element={<RoleGuard roles={['TEACHER']} />}>
                <Route path="groups/create" element={<CreateGroupPage />} />
                <Route path="teacher/dashboard" element={<TeacherDashboardPage />} />
                <Route path="teacher/quizzes" element={<TeacherQuizListPage />} />
                <Route path="teacher/quizzes/create" element={<CreateQuizPage />} />
                <Route path="teacher/quizzes/:id/submissions" element={<TeacherQuizSubmissionsPage />} />
                <Route
                  path="teacher/quizzes/:id/submissions/:attemptId"
                  element={<TeacherSubmissionDetailPage />}
                />
              </Route>
            </Route>

            <Route element={<RoleGuard roles={['ADMIN']} redirectTo="/" />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/posts" element={<AdminPostsPage />} />
                <Route path="admin/reports" element={<AdminReportsPage />} />
                <Route path="admin/teachers" element={<AdminTeachersPage />} />
                <Route path="admin/quizzes" element={<AdminQuizPendingPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </WebSocketProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
