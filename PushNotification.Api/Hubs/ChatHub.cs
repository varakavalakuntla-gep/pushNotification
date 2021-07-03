using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using PushNotification.Api.Hubs.Clients;
using PushNotification.Api.Models.cs;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using PushNotification.Api.Models;

namespace PushNotification.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>, IChatHub
    {
        private readonly IConfiguration configuration;
        public ChatHub(IConfiguration config)
        {
            this.configuration = config;
        }

        public async Task SendMessage()
        {
            string connectionString = configuration.GetConnectionString("DefaultConnectionString");

            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            SqlCommand com = new SqlCommand("Select * from dbo.notifications order by AddedOn desc", connection);
            using SqlDataReader sqlDataReader = await com.ExecuteReaderAsync();
            List<NotificaitonsResponse> responeList = new List<NotificaitonsResponse>();
            if (sqlDataReader.HasRows)
            {
                while (await sqlDataReader.ReadAsync())
                {
                    NotificaitonsResponse response = new NotificaitonsResponse
                    {
                        notification_id = (int)sqlDataReader[0],
                        title = (string)sqlDataReader[1],
                        body = (string)sqlDataReader[2],
                        category = (int)sqlDataReader[3],
                        AddedOn = (DateTime)sqlDataReader[4],
                        readyn = (int)sqlDataReader[5]
                    };
                    responeList.Add(response);
                }
            };
            connection.Close();
            await Clients.All.ReceiveMessage(responeList);
        }

        public async Task SendAlert()
        {
            await Clients.All.Alert(1);
        }
    }
}
