namespace Repo;

 public class CheckoutFormModel
    {
        public string? ClassName { get; set; }
        public string? ClassDescription { get; set; }
        public long Amount { get; set; }
        public string? Currency { get; set; }

        public int classId {get; set;}
    }