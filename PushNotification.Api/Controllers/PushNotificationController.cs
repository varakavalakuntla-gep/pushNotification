using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PushNotification.Api.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using PushNotification.Api.Hubs.Clients;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using PushNotification.Api.Models;
using PushNotification.Api.Models.cs;

namespace PushNotification.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PushNotificationController : ControllerBase
    {
        IHubContext<ChatHub, IChatClient> _chatHubContext;
        private readonly IConfiguration configuration;
        public PushNotificationController(IHubContext<ChatHub, IChatClient> chatHubContext, IConfiguration config)
        {
            _chatHubContext = chatHubContext;
            this.configuration = config;

        }
        [HttpGet("")]
        public async Task Get()
        {
            await _chatHubContext.Clients.All.Alert(1);
        }
        [HttpPost("")]
        public async Task Post(NotificaitonsResponse request)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnectionString");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "insert into dbo.notifications (title,body,category,AddedOn,readyn) values(@title, @body, @category, @AddedOn, @readyn)";
            SqlCommand cmd = new SqlCommand(query, connection);

            //Pass values to Parameters
            cmd.Parameters.AddWithValue("@title", request.title);
            cmd.Parameters.AddWithValue("@body", request.body);
            cmd.Parameters.AddWithValue("@category", request.category);
            cmd.Parameters.AddWithValue("@AddedOn", DateTime.UtcNow);
            cmd.Parameters.AddWithValue("@readyn", 0);
            cmd.Parameters.AddWithValue("@delivered", 0);
            cmd.Parameters.AddWithValue("@deleted", 0);

            connection.Open();
            cmd.ExecuteNonQuery();
            Console.WriteLine("Records Inserted Successfully");

            var cmdString = "INSERT INTO trash SELECT * FROM notifications WHERE AddedOn < DATEADD(day, -30, GETDATE()); DELETE FROM notifications WHERE AddedOn < DATEADD(day, -15, GETDATE()); ";
            SqlCommand q = new SqlCommand(cmdString, connection);
            q.ExecuteNonQuery();


            var cmdString1 = "select count(*) from notifications where readyn=0 and deleted=0";
            SqlCommand com1 = new SqlCommand(cmdString1, connection);
            var cnt = (int)com1.ExecuteScalar();

            connection.Close();
            await _chatHubContext.Clients.All.Alert(cnt);
            await _chatHubContext.Clients.All.NewMessage(request);
        }

    }
}
