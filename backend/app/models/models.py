import uuid
from datetime import datetime
from sqlalchemy import (Column, String, Integer, Boolean, Text, DateTime,
                        Float, ForeignKey, ARRAY)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    user_id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name             = Column(String(100), nullable=False)
    email            = Column(String(150), unique=True, nullable=False, index=True)
    password_hash    = Column(String(255), nullable=False)
    age              = Column(Integer)
    gender           = Column(String(20))
    pregnancy_status = Column(Boolean, default=False)
    created_at       = Column(DateTime, default=datetime.utcnow)
    conditions       = relationship("UserCondition", back_populates="user", cascade="all, delete")
    search_history   = relationship("SearchHistory",  back_populates="user", cascade="all, delete")


class Disease(Base):
    __tablename__ = "diseases"
    disease_id     = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(150), nullable=False, index=True)
    common_name    = Column(String(100))
    category       = Column(String(80))
    description    = Column(Text)
    severity_level = Column(String(20))
    icd10_code     = Column(String(10))
    medicines      = relationship("DiseaseMedicineMap", back_populates="disease")
    foods          = relationship("DiseaseFoodMap",     back_populates="disease")


class Medicine(Base):
    __tablename__ = "medicines"
    medicine_id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    generic_name        = Column(String(200), nullable=False, index=True)
    brand_names         = Column(ARRAY(String))
    drug_class          = Column(String(100))
    mechanism           = Column(Text)
    common_side_effects = Column(ARRAY(String))
    serious_warnings    = Column(ARRAY(String))
    pregnancy_category  = Column(String(5))
    is_otc              = Column(Boolean, default=False)


class DiseaseMedicineMap(Base):
    __tablename__ = "disease_medicine_map"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id        = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    medicine_id       = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    relationship_type = Column(String(30))  # Recommended / Avoid / Caution
    reason            = Column(Text)
    disease           = relationship("Disease",  back_populates="medicines")
    medicine          = relationship("Medicine")


class DrugInteraction(Base):
    __tablename__ = "drug_interactions"
    interaction_id  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medicine_a_id   = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    medicine_b_id   = Column(UUID(as_uuid=True), ForeignKey("medicines.medicine_id"))
    severity        = Column(String(30))
    clinical_effect = Column(Text)
    management      = Column(Text)
    medicine_a      = relationship("Medicine", foreign_keys=[medicine_a_id])
    medicine_b      = relationship("Medicine", foreign_keys=[medicine_b_id])


class Food(Base):
    __tablename__ = "foods"
    food_id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(150), nullable=False)
    local_names    = Column(ARRAY(String))
    category       = Column(String(50))
    glycemic_index = Column(Integer)


class DiseaseFoodMap(Base):
    __tablename__ = "disease_food_map"
    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_id          = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    food_id             = Column(UUID(as_uuid=True), ForeignKey("foods.food_id"))
    recommendation      = Column(String(30))
    reason              = Column(Text)
    quantity_suggestion = Column(String(200))
    disease             = relationship("Disease", back_populates="foods")
    food                = relationship("Food")


class UserCondition(Base):
    __tablename__ = "user_conditions"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    disease_id = Column(UUID(as_uuid=True), ForeignKey("diseases.disease_id"))
    user       = relationship("User", back_populates="conditions")
    disease    = relationship("Disease")


class SearchHistory(Base):
    __tablename__ = "search_history"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    query       = Column(String(300))
    query_type  = Column(String(30))  # disease / symptom / drug
    created_at  = Column(DateTime, default=datetime.utcnow)
    user        = relationship("User", back_populates="search_history")
