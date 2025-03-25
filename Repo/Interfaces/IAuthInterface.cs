public interface IAuthInterface
{
    #region Reset Password
    Task<int> dispatchOtp(string email);
    Task<int> verifyOtp(string email, int OTP);
    Task<int> updatePassword(string email, string newPassword, int OTP);
    #endregion
}