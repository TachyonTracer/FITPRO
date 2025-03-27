namespace Repo;

using Elastic.Clients.Elasticsearch.Security;

public interface IUserInterface{
    public Task<bool> UpdateUserProfileAsync(User user);
}