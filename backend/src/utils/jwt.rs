use chrono::{Duration, Utc};
use jsonwebtoken::decode;
use jsonwebtoken::encode;
use jsonwebtoken::DecodingKey;
use jsonwebtoken::EncodingKey;
use jsonwebtoken::Header;
use jsonwebtoken::TokenData;
use jsonwebtoken::Validation;
use serde::{Deserialize, Serialize};

use super::constants;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub exp: usize,    // Expiration time
    pub iat: usize,    // Issued at (the time at which the token was created)
    pub email: String, //User email
    pub id: i32,       //User id
}

pub fn encode_jwt(email: String, id: i32) -> Result<String, jsonwebtoken::errors::Error> {
    let now = Utc::now(); //Current time
    let expire = Duration::hours(24); //Token expires in 24 hours

    let claims = Claims {
        exp: (now + expire).timestamp() as usize,
        iat: now.timestamp() as usize,
        email,
        id,
    };

    let secret = (*constants::SECRET).clone();

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
}

pub fn decode_jwt(jwt: String) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = (*constants::SECRET).clone();
    let claim_data: Result<TokenData<Claims>, jsonwebtoken::errors::Error> = decode(
        &jwt,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    );
    claim_data
}
