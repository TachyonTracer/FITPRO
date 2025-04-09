using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public class EmailModel
    {
        public string? To{get;set;}
        public string? Subject{get;set;}
        public string? Body{get;set;}
        public string? EmailId{get;set;}
        public string? Password{get;set;}
    }
}