using Microsoft.AspNetCore.Mvc;
using Two_Cetns_Backend.Models;
using Two_Cetns_Backend.Validators;
namespace Two_Cetns_Backend.Controller;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    [HttpPost]
    public IActionResult Register (RegisterRequest registerRequest)
    {

        if (!UserInfoValidator.ValidateUserInfo(registerRequest))
        {
            return BadRequest("Invalid user information. Please check the provided data and try again.");
        }

        // Check no other user is registered with the same email


        // enter user in DB



        return Ok("Registration Successful");
    }
}
