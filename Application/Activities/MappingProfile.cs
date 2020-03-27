using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dst => dst.Username, options => options.MapFrom(src => src.AppUser.UserName))
                .ForMember(dst => dst.DisplayName, options => options.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dst => dst.Image, options => options.MapFrom(src => src.AppUser.Photos.FirstOrDefault(f => f.IsMain).Url))
                .ForMember(dst => dst.Following, options => options.MapFrom<FollowingResolver>());
        }
    }
}