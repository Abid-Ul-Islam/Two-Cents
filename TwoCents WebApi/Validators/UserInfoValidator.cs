using Two_Cetns_Backend.Models;

namespace Two_Cetns_Backend.Validators;

public static class UserInfoValidator
{
    public static bool ValidateUserInfo (RegisterRequest registerRequest)
    {
        if (string.IsNullOrEmpty(registerRequest.Name))
        {
            return false;
        }

        return true;
    }
}
