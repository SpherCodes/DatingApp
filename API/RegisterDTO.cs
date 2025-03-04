using System;
using System.ComponentModel.DataAnnotations;

namespace API;

public class RegisterDTO
{
    [Required]
    public  string UserName { get; set; }
    [Required]
    public required string Password { get; set; }
}
