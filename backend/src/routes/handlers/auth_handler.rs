use crate::utils::app_state::AppState;
use crate::utils::jwt::encode_jwt;
use actix_web::Responder;
use actix_web::{post, web, HttpResponse};
use bcrypt::{hash, verify, DEFAULT_COST};
use entity::users::ActiveModel;
use entity::users::Column;
use entity::users::Entity;
use entity::users::Model;
use sea_orm::entity::Set;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use serde::{Deserialize, Serialize};

//register
#[post("/register")]
pub async fn register(
    app_state: web::Data<AppState>,
    register_json: web::Json<Model>,
) -> impl Responder {
    //database connection
    let db = &app_state.db;

    //Hash password
    let hashed_password = match hash(&register_json.password, DEFAULT_COST) {
        Ok(value) => value,
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };

    let user_model = ActiveModel {
        first_name: Set(register_json.first_name.clone()),
        email: Set(register_json.email.clone()),
        password: Set(hashed_password),
        ..Default::default()
    };

    match Entity::insert(user_model).exec_with_returning(db).await {
        Ok(insert_result) => return HttpResponse::Ok().json(insert_result),
        Err(err) => {
            if err
                .to_string()
                .contains("duplicate key value violates unique constraint")
            {
                return HttpResponse::BadRequest().body("Email Already Exists");
            } else {
                return HttpResponse::InternalServerError().body(err.to_string());
            }
        }
    };
}

#[derive(Deserialize, Serialize)]
struct LoginInfo {
    email: String,
    password: String,
}
#[post("/login")]
pub async fn login(
    app_state: web::Data<AppState>,
    login_json: web::Json<LoginInfo>,
) -> impl Responder {
    let db = &app_state.db;

    //find user
    let user = match Entity::find()
        .filter(Column::Email.eq(login_json.email.clone()))
        .one(db)
        .await
    {
        Ok(value) => match value {
            Some(user) => user,
            None => return HttpResponse::NotFound().body("User Not Found"),
        },
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };

    //verify password
    match verify(&login_json.password, &user.password) {
        Ok(matched) => {
            if matched {  //if passwords match 
                //Generate JWT token
                match encode_jwt(user.email, user.id) {
                    Ok(token) => return HttpResponse::Ok().json(token),  //jwt token generated successfuly. return it
                    Err(err) => return HttpResponse::InternalServerError().body(err.to_string()), //error occurs while generating token
                }
            } else { //passwords dont match
                return HttpResponse::Unauthorized().body("Invalid Password");
            }
        }
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()), //internal server error
    }
}
