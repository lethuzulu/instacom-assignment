use entity::leads::{ActiveModel, Entity};
use sea_orm::error::RuntimeErr::Internal;
use sea_orm::{EntityTrait, Set};
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        let db = manager.get_connection();

        let schema = manager
            .create_table(
                Table::create()
                    .table(Leads::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Leads::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Leads::FirstName).string().not_null())
                    .col(ColumnDef::new(Leads::LastName).string().not_null())
                    .col(ColumnDef::new(Leads::Email).string().not_null())
                    .col(ColumnDef::new(Leads::Phone).string().not_null())
                    .col(
                        ColumnDef::new(Leads::CreatedAt)
                            .date()
                            .default(Expr::current_date())
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await;

        for i in 1..=9 {
            // Generate the created_at date for the nth day of July 2024 [1-9]
            let string_date = format!("2024-07-{:02}", i); // Ensures day is two digits
            let created_at_date = match chrono::NaiveDate::parse_from_str(&string_date, "%Y-%m-%d")
            {
                Ok(date) => date,
                Err(_) => return Err(DbErr::Exec(Internal("Invalid date format".to_string()))),
            };

            let lead = ActiveModel {
                first_name: Set(format!("First_{}", i)),
                last_name: Set(format!("Last_{}", i)),
                email: Set(format!("firstlast{}@gmail.com", i)),
                phone: Set(format!("firstlast{}", i)),
                created_at: Set(created_at_date),
                ..Default::default()
            };

            match Entity::insert(lead).exec(db).await {
                Ok(_) => (),
                Err(err) => return Err(err),
            }
        }

        schema
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager
            .drop_table(Table::drop().table(Leads::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Leads {
    Table,
    Id,
    FirstName,
    LastName,
    Email,
    Phone,
    CreatedAt,
}
