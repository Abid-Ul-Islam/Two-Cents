using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Validators;

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
