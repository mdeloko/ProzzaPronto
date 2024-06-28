import pg from "pg";
const PORT = Number(process.env.PG_PORT);

class bdConnectionController{
    private conn:pg.Pool
    constructor(){
        this.conn = new pg.Pool({user:process.env.PG_USER,password:process.env.PG_PASS,host:process.env.PG_HOST,port:PORT,database:process.env.PG_DB})

    }
    async startDbCon():Promise<void>{
        try{
            this.conn.connect();
            console.log("Sucesso ao conectar ao PostgreSQL!");
        }catch(err){
            console.error("Erro ao conectar: ",err);
        }
    }
    async checkConnection(){
        try{
            this.conn.connect();
            console.log("Sucesso ao conectar ao PostgreSQL!");
        }catch(err){
            console.error("Erro ao conectar: ",err);
        }finally{
            await this.conn.end();
        }
    }
    getDB(){
        return this.conn;
    }
    
}

export default bdConnectionController;