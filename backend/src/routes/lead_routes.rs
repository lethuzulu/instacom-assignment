use super::handlers;
use super::middleware::auth_middleware::check_auth_middleware;
use actix_web::web;
use actix_web_lab::middleware::from_fn;

pub fn config(config: &mut web::ServiceConfig) {
    config.service(
        web::scope("/leads")
            .wrap(from_fn(check_auth_middleware))
            .service(handlers::lead_handler::create_lead)
            .service(handlers::lead_handler::read)
            .service(handlers::lead_handler::read_lead_by_id)
            .service(handlers::lead_handler::delete_lead)
            .service(handlers::lead_handler::update_lead),
    );
}
