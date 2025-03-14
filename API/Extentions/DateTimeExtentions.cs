using System;

namespace API.Extentions;

public static class DateTimeExtentions
{
    public static int CalculateAge(this DateOnly dob){
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - dob.Year;
        if( dob > today.AddYears(-age)) age--;
        return age;
    }
}
