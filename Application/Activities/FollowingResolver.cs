using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }
        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            string username = _userAccessor.GetCurrentUsername();
            var currentUser = _context.Users.SingleOrDefaultAsync(f => f.UserName == username).Result;

            if (currentUser.Followings.Any(f => f.TargetId == source.AppUserId))
                return true;

            return false;
        }
    }
}