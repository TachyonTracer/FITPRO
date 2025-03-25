namespace Repo;

public class Response
{
    public bool success => string.IsNullOrEmpty(message);
    public string message { get; set; }
    
}