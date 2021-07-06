using PushNotification.Api.Models;
using PushNotification.Api.Models.cs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PushNotification.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(List<NotificaitonsResponse> responsesList);
        Task Alert(int message);
        Task NewMessage(NotificaitonsResponse response);
    }
}
