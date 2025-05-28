namespace API.DTOs
{
    public class VisitDto
    {
        public int Id { get; set; }
        public int VisitorId { get; set; }
        public required string VisitorUsername { get; set; }
        public required string VisitorPhotoUrl { get; set; }
        public required string VisitorKnownAs { get; set; }
        public DateTime VisitDate { get; set; }
    }
}