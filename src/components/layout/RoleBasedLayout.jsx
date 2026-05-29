import { useAuth } from '../../context/AuthContext'
import StudentLayout from './StudentLayout'
import TeacherLayout from './TeacherLayout'

export default function RoleBasedLayout() {
  const { isTeacher } = useAuth()
  return isTeacher ? <TeacherLayout /> : <StudentLayout />
}
