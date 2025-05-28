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
                .ConvertUsing(dateTime => dateTime.HasValue ? DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Utc) : null); CreateMap<UserVisit, VisitDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.VisitorId * 1000000 + src.VisitedId)) // Create unique Id from composite key
                .ForMember(dest => dest.VisitorId, opt => opt.MapFrom(src => src.VisitorId))
                .ForMember(dest => dest.VisitorUsername, opt => opt.MapFrom(src => src.Visitor!.UserName))
                .ForMember(dest => dest.VisitorPhotoUrl, opt => opt.MapFrom(src => src.Visitor!.Photos.FirstOrDefault(x => x.IsMain)!.Url))
                .ForMember(dest => dest.VisitorKnownAs, opt => opt.MapFrom(src => src.Visitor!.KnownAs))
                .ForMember(dest => dest.VisitDate, opt => opt.MapFrom(src => src.VisitDate));
        }
    }
}
