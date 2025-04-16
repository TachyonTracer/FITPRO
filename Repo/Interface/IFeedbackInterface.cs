
using System.Collections.Generic;

namespace Repo;
public interface IFeedbackInterface
{
    // Instructor Feedback
    bool AddInstructorFeedback(InstructorFeedback feedback);
    List<InstructorFeedback> GetInstructorFeedbacksByInstructorId(int instructorId);

    // Class Feedback


    
    bool AddClassFeedback(ClassFeedback feedback);
    List<ClassFeedback> GetClassFeedbacksByClassId(int classId);

    // Validation
    bool HasUserJoinedClass(int userId, int classId);

    List<ClassFeedback> GetClassFeedbacksByInstructorId(int instructorId);

}
