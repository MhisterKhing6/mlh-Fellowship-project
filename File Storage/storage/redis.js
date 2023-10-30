import { createClient } from "redis";

class RedisCatch {
    isconnected = false;
    constructor() {
    this.redis_server = createClient().connect(()=> this.isconnected = true);
    }
    
    setVariable = async (key, value, time=432000000) => (await this.redis_server).set(key, value, time)
    getVariable = async (key) => (await this.redis_server).get(key)
    isAlvie = () => this.isAlive;
}

export default new RedisCatch()