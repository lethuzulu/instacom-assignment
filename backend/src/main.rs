use actix_cors::Cors;
use actix_web::web;
use actix_web::App;
use actix_web::HttpServer;
use migration::Migrator;
use migration::MigratorTrait;
use sea_orm::Database;
use sea_orm::DatabaseConnection;
use std::result::Result;

use utils::app_state::AppState;

mod routes;
mod utils;

#[derive(Debug)]
struct MainError {
    message: String,
}

#[actix_web::main]
async fn main() -> Result<(), MainError> {
    let database_url: String = (*utils::constants::DATABASE_URL).clone();
    let address: String = (*utils::constants::ADDRESS).clone();
    let port = (*utils::constants::PORT).clone();

    let db: DatabaseConnection = match Database::connect(database_url).await {
        Ok(db) => db,
        Err(error) => {
            return Err(MainError {
                message: error.to_string(),
            })
        }
    };

    match Migrator::up(&db, None).await {
        Ok(_) => println!("Migrations Ran Successfully"),
        Err(error) => {
            return Err(MainError {
                message: error.to_string(),
            })
        }
    }

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(AppState { db: db.clone() }))
            .configure(routes::auth_routes::config)
            .configure(routes::lead_routes::config)
    })
    .bind((address, port))
    .map_err(|error| MainError {
        message: error.to_string(),
    })?
    .run()
    .await
    .map_err(|error| MainError {
        message: error.to_string(),
    })
}
