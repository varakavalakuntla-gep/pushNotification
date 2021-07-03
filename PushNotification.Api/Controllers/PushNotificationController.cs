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
            cmd.Parameters.AddWithValue("@readyn", 1);
            cmd.Parameters.AddWithValue("@delivered", 0);
            cmd.Parameters.AddWithValue("@deleted", 0);

            connection.Open();
            cmd.ExecuteNonQuery();
            Console.WriteLine("Records Inserted Successfully");
            await _chatHubContext.Clients.All.Alert(1);
        }
        [HttpPost("/action")]
        public async void PerformAction(resqustobj request)
        {
            List<int> arr_id = request.arr_id;
            string action = request.action;
            string connectionString = configuration.GetConnectionString("DefaultConnectionString");
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            string s = "(";
            foreach (int ele in arr_id)
            {
                s += ele.ToString();
                s += ",";
            }
            s = s.Remove(s.Length - 1); s += ")";
            string colname="", value="";
            switch (action)
            {
                case "read": colname = "readyn"; value = "1"; break;
                case "unread": colname = "readyn"; value = "0"; break;
                case "deliver": colname = "delivered"; value = "1"; break;
                case "delete": colname = "deleted"; value = "1"; break;
            }

            var cmdString = "update dbo.notifications set "+ colname + " = " + value +" where notification_id in " + s;
            SqlCommand com = new SqlCommand(cmdString, connection);
            com.ExecuteNonQuery();

            connection.Close();
        }

    }
}
