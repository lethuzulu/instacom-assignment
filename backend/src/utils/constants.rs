use lazy_static::lazy_static;
use std::env;

lazy_static! {
    pub static ref DATABASE_URL: String = set_database();
    pub static ref SECRET: String = set_secret();
    pub static ref ADDRESS: String = set_address();
    pub static ref PORT: u16 = set_port();
}

fn set_address() -> String {
    dotenv::dotenv().ok();
    env::var("ADDRESS").unwrap_or("127.0.0.1".to_string())
}

fn set_port() -> u16 {
    dotenv::dotenv().ok();
    env::var("PORT")
        .unwrap_or("8080".to_owned())
        .parse::<u16>()
        .expect("Can't Parse the Port")
}

fn set_database() -> String {
    dotenv::dotenv().ok();
    env::var("DATABASE_URL").unwrap_or("postgres://lethu:lethu@localhost:5432/instacom".to_string())
}

fn set_secret() -> String {
    dotenv::dotenv().ok();
    env::var("SECRET").unwrap_or("SECRET.".to_string())
}
