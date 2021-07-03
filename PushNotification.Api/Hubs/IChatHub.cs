using Microsoft.AspNetCore.SignalR;
using PushNotification.Api.Hubs.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PushNotification.Api.Hubs
{
    public interface IChatHub
    {
        Task SendAlert();
    }
}
