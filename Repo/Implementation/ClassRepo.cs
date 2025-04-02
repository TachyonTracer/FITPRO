using Microsoft.AspNetCore.Http;

namespace Repo;

using Npgsql;
using Newtonsoft.Json;
using System.Text.Json;
using System.Data;
public class ClassRepo : IClassInterface
{
    public readonly NpgsqlConnection _conn;
    public ClassRepo(NpgsqlConnection conn)
    {
        _conn = conn;
    }

    #region  User-Story :List Classes
    #region GetAllClasess
    public async Task<List<Class>> GetAllClasses()
    {
        List<Class> classes = new List<Class>();
        try
        {
            using (var cmd = new NpgsqlCommand("SELECT t1.*,t2.c_instructorname FROM t_Class t1 join t_instructor t2 on t1.c_instructorid = t2.c_instructorid", _conn))
            {
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var classObj = new Class()
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),
                            instructorName = reader["c_instructorname"].ToString(),
                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                            availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        };

                        classes.Add(classObj);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        return classes;
    }
    #endregion

    #region GetClassById
    public async Task<List<Class>> GetClassById(string id)
    {
        List<Class> task = new List<Class>();
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }
            using (var cmd = new NpgsqlCommand("SELECT * FROM t_Class WHERE c_instructorid = @c_instructorid AND c_status != 'suspended'", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", int.Parse(id));
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        task.Add(new Class()
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),

                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                            availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        });
                    }
                }
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return task;
    }
    #endregion

    #region GetOne
    public async Task<Class> GetOne(string id)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }
            using (var cmd = new NpgsqlCommand("SELECT * FROM t_Class WHERE c_classid = @c_classid", _conn))
            {
                cmd.Parameters.AddWithValue("@c_classid", int.Parse(id));
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new Class
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),

                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                             availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        };
                    }
                }
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return null;
    }
    #endregion

    #endregion
}