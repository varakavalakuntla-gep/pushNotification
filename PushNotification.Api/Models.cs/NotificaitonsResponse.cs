using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PushNotification.Api.Models
{
    public class NotificaitonsResponse
    {
        public int notification_id { get; set; }
        public string title { get; set; }
        public string body { get; set; }
        public int category { get; set; }
        public DateTime AddedOn { get; set; }
        public int readyn { get; set; }
    }
}
