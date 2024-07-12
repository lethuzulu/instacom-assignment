use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    http::header::AUTHORIZATION,
    Error, HttpMessage,
};
use actix_web_lab::middleware::Next;

use crate::utils::{api_response, jwt::decode_jwt};

pub async fn check_auth_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let auth = match req.headers().get(AUTHORIZATION) {
        Some(value) => value,
        None => {
            return Err(Error::from(api_response::ApiResponse::new(
                401,
                "Unauthorised".to_string(),
            )));
        }
    };

    let token = match auth.to_str() {
        Ok(value) => value.replace("Bearer ", "").to_owned(),
        Err(_) => {
            return Err(Error::from(api_response::ApiResponse::new(
                401,
                "Unauthorised".to_string(),
            )));
        }
    };

    let claim = match decode_jwt(token) {
        Ok(value) => value,
        Err(_) => {
            return Err(Error::from(api_response::ApiResponse::new(
                401,
                "Unauthorised".to_string(),
            )));
        }
    };
    req.extensions_mut().insert(claim.claims);
    next.call(req).await
}
