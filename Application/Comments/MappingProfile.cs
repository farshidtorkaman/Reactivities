using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dst => dst.Username, options => options.MapFrom(src => src.Author.UserName))
                .ForMember(dst => dst.DisplayName, options => options.MapFrom(src => src.Author.DisplayName))
                .ForMember(dst => dst.Image, options => options.MapFrom(src => src.Author.Photos.FirstOrDefault(f => f.IsMain).Url));
        }        
    }
}