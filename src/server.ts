import { Server,Model,Factory, Request} from 'miragejs';
import {User} from './Interfaces/user.interface'


export default function CreateServer ():Server {

return (

new Server ({

      models: {
          user: Model
      },

      factories: {
          user: Factory.extend ({
              username: "test",
              password: "12345",
              email: "example@gmail.com"
          })
      },
      
      seeds: (server):any => {
        server.create('user');
      },

      routes(): void {

        this.urlPrefix = 'https://diaries.app';

        this.get("/users", (schema:any):User[] => {
            return schema.users.all();
          })

          this.post("/addusers", (schema:any, request:Request): User => {
            let attrs = JSON.parse(request.requestBody)
            console.log(attrs)
            return schema.users.create(attrs)
          })


          this.post("/login", (schema:any, request:Request) => {
            let {username} = JSON.parse(request.requestBody)
            console.log(username);
            return username
          })

      }
      
    })
)

}