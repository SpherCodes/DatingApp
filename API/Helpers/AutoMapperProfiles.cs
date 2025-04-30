using API.DTOs;
using API.Entities;
using API.Extentions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
            .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOfBirth.CalculateAge()))
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain)!.Url));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<string, DateOnly>()
                .ConvertUsing(dateString => DateOnly.Parse(dateString));
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain)!.Url))
                .ForMember(d => d.RecipientPhotoUrl, o => o.MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain)!.Url));

            CreateMap<DateTime, DateTime>()
                .ConvertUsing(dateTime => DateTime.SpecifyKind(dateTime, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(dateTime => dateTime.HasValue ? DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Utc) : null);
        }
    }
}
