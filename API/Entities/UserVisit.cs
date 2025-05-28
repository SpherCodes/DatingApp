using System;

namespace API.Entities
{
    public class UserVisit
    {
        public int VisitorId { get; set; }
        public AppUser? Visitor { get; set; }
        public int VisitedId { get; set; }
        public AppUser? Visited { get; set; }
        public DateTime VisitDate { get; set; } = DateTime.UtcNow;
    }
}