use crate::utils::app_state::AppState;
use actix_web::{delete, get, post, put, web, HttpResponse, Responder};
use entity::leads::ActiveModel;
use entity::leads::Column;
use entity::leads::Entity;
use entity::leads::Model;
use sea_orm::entity::Set;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use serde::Deserialize;

#[post("/")]
pub async fn create_lead(
    app_state: web::Data<AppState>,
    lead_json: web::Json<Model>,
) -> impl Responder {
    let db = &app_state.db;

    let lead_model = ActiveModel {
        first_name: Set(lead_json.first_name.clone()),
        last_name: Set(lead_json.last_name.clone()),
        email: Set(lead_json.email.clone()),
        phone: Set(lead_json.phone.clone()),
        created_at: Set(chrono::Local::now().naive_local().date()), 
        ..Default::default()
    };

    match Entity::insert(lead_model).exec_with_returning(db).await {
        Ok(lead) => return HttpResponse::Ok().json(lead),
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[derive(Deserialize)]
struct Info {
    start_date: Option<String>,
    end_date: Option<String>,
}

#[get("/")]
pub async fn read(app_state: web::Data<AppState>, query: web::Query<Info>) -> impl Responder {
    let db = &app_state.db;
    //if start_date and end_date are not provided, return all leads

    if query.start_date.is_none() && query.end_date.is_none() {
        match Entity::find().all(db).await {
            Ok(leads) => return HttpResponse::Ok().json(leads),
            Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
        };
    }

    //if start_date and end_date are provided, return leads between the dates
    let start_date = match query.start_date.clone() {
        Some(date) => match chrono::NaiveDate::parse_from_str(&date, "%Y-%m-%d") {
            Ok(date) => date,                                                               
            Err(_) => return HttpResponse::BadRequest().body("Invalid Date Format"), //malformed start_date format
        },
        None => return HttpResponse::BadRequest().body("Start Date Required"),   //start_date missing
    };

    let end_date = match query.end_date.clone() {
        Some(date) => match chrono::NaiveDate::parse_from_str(&date, "%Y-%m-%d") {
            Ok(date) => date,
            Err(_) => return HttpResponse::BadRequest().body("Invalid Date Format"),  //malformed end_data format
        },
        None => return HttpResponse::BadRequest().body("End Date Required"),  //start_ date missing
    };

    match Entity::find()
        .filter(Column::CreatedAt.between(start_date, end_date))  //filters for the range of days between start_date and end_date
        .all(db)
        .await
    {
        Ok(leads) => return HttpResponse::Ok().json(leads), 
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };
}

#[get("/{id}")]
pub async fn read_lead_by_id(app_state: web::Data<AppState>, id: web::Path<i32>) -> impl Responder {
    let db = &app_state.db;

    let id = id.into_inner();

    match Entity::find_by_id(id).one(db).await {
        Ok(lead) => match lead {
            Some(lead) => return HttpResponse::Ok().json(lead),
            None => return HttpResponse::NotFound().body("Lead Not Found"),
        },
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/{id}")]
pub async fn delete_lead(app_state: web::Data<AppState>, id: web::Path<i32>) -> impl Responder {
    let db = &app_state.db;

    let id = id.into_inner();

    let row = ActiveModel {
        id: Set(id),
        ..Default::default()
    };

    match Entity::delete(row).exec(db).await {
        Ok(_) => return HttpResponse::Ok().body("1".to_string()),
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };
}

#[put("/{id}")]
pub async fn update_lead(
    app_state: web::Data<AppState>,
    id: web::Path<i32>,
    update_json: web::Json<Model>,
) -> impl Responder {
    let db = &app_state.db;

    let id = id.into_inner();

    let row = ActiveModel {
        id: Set(id),
        first_name: Set(update_json.first_name.clone()),
        last_name: Set(update_json.last_name.clone()),
        email: Set(update_json.email.clone()),
        phone: Set(update_json.phone.clone()),
        ..Default::default()
    };

    match Entity::update(row).exec(db).await {
        Ok(model) => return HttpResponse::Ok().json(model),
        Err(err) => return HttpResponse::InternalServerError().body(err.to_string()),
    };
}
