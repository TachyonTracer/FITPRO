import pandas as pd
import joblib
import numpy as np
import os

# Updated paths to use OS-agnostic path joining
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Models')

try:
    model = joblib.load(os.path.join(MODEL_DIR, 'fitpro_class_popularity_model.pkl'))
    feature_columns = joblib.load(os.path.join(MODEL_DIR, 'feature_columns.pkl'))
    feature_importance = joblib.load(os.path.join(MODEL_DIR, 'feature_importance.pkl'))
except FileNotFoundError as e:
    print(f"Error: {e}. Please ensure .pkl files are in the Models directory.")
    exit(1)

# Use your existing functions (already defined in your code)
def prepare_new_class_for_prediction(new_class, training_features):
    # Your existing function from the code
    
     # Convert ISO format dates to datetime then to desired format
    new_class['c_startdate'] = pd.to_datetime(new_class['c_startdate']).dt.strftime('%d-%m-%Y')
    new_class['c_enddate'] = pd.to_datetime(new_class['c_enddate']).dt.strftime('%d-%m-%Y')
        
    new_class['c_startdate'] = pd.to_datetime(new_class['c_startdate'], format='%d-%m-%Y')
    new_class['c_enddate'] = pd.to_datetime(new_class['c_enddate'], format='%d-%m-%Y')
    new_class['c_starttime'] = pd.to_datetime(new_class['c_starttime']).dt.time
    new_class['c_endtime'] = pd.to_datetime(new_class['c_endtime']).dt.time
    
    new_class['start_hour'] = pd.to_datetime(new_class['c_starttime'], format='%H:%M:%S').dt.hour
    new_class['calculated_duration'] = new_class['c_duration']
    new_class['equipment_count'] = new_class['c_requiredequipments'].str.count(';') + 1
    new_class['Is_Weekend'] = new_class['Is_Weekend'].map({'Yes': 1, 'No': 0})
    
    categorical_features = ['c_type', 'Gender', 'Session', 'c_city']
    
    X_new = pd.DataFrame({
        'c_duration': new_class['c_duration'],
        'c_maxcapacity': new_class['c_maxcapacity'],
        'c_fees': new_class['c_fees'],
        'Rating': new_class['Rating'],
        'Is_Weekend': new_class['Is_Weekend'],
        'start_hour': new_class['start_hour'],
        'equipment_count': new_class['equipment_count']
    })
    
    for feature in categorical_features:
        if feature in new_class.columns:
            one_hot = pd.get_dummies(new_class[feature], prefix=feature.replace('c_', ''))
            X_new = pd.concat([X_new, one_hot], axis=1)
    
    for feature in training_features:
        if feature not in X_new.columns:
            X_new[feature] = 0
    
    X_new = X_new[training_features]
    return X_new

def predict_class_popularity(model, new_class_data, feature_columns):
    # Your existing function from the code
    missing_cols = set(feature_columns) - set(new_class_data.columns)
    for col in missing_cols:
        new_class_data[col] = 0
    
    new_class_data = new_class_data[feature_columns]
    
    prediction = model.predict(new_class_data)
    probability = model.predict_proba(new_class_data)[:, 1]
    
    return prediction[0], probability[0]

def interpret_prediction(prediction, probability, new_class_data, feature_importance):
    # Your existing function from the code
    result = {}
    result['is_popular'] = bool(prediction)
    result['popularity_probability'] = float(probability)
    result['confidence_level'] = 'High' if abs(probability) > 0.9 else 'Medium' if abs(probability) > 0.7 else 'Low'
    
    top_features = feature_importance.head(5)['Feature'].tolist()
    reasons = []
    
    for feature in top_features:
        if feature in new_class_data.columns:
            value = new_class_data[feature].values[0]
            if feature == 'c_fees':
                if value > 1000:
                    reasons.append(f"The class fee (₹{value}) is relatively high")
                else:
                    reasons.append(f"The class fee (₹{value}) is affordable")
            elif feature == 'Rating':
                if value >= 4.2:
                    reasons.append(f"High instructor rating ({value}/5.0)")
                elif value <= 3.7:
                    reasons.append(f"Lower instructor rating ({value}/5.0)")
            elif feature == 'start_hour':
                if 6 <= value <= 9:
                    reasons.append("Morning time slot (generally popular)")
                elif 17 <= value <= 20:
                    reasons.append("Evening time slot (generally popular)")
            elif feature == 'Is_Weekend':
                if value == 1:
                    reasons.append("Weekend classes tend to have different attendance patterns")
            elif feature == 'enrollment_percentage':
                if value > 50:
                    reasons.append("Classes with high enrollment percentage tend to attract more students")
            elif 'type_' in feature:
                class_type = feature.replace('type_', '')
                reasons.append(f"Class type ({class_type}) is a significant factor")
            elif 'session_' in feature:
                session = feature.replace('session_', '')
                reasons.append(f"{session} sessions have distinct popularity patterns")
            elif 'city_' in feature:
                city = feature.replace('city_', '')
                reasons.append(f"Location in {city} affects class popularity")
    
    result['reasons'] = reasons
    
    recommendations = []
    if prediction == 1:
        recommendations.append("Consider maximizing capacity for this class")
        recommendations.append("Ensure adequate staff and resources are available")
        recommendations.append("Highlight this class in marketing materials")
    else:
        if 'c_fees' in new_class_data.columns and new_class_data['c_fees'].values[0] > 1000:
            recommendations.append("Consider adjusting the price point to attract more participants")
        if 'start_hour' in new_class_data.columns:
            hour = new_class_data['start_hour'].values[0]
            if not (6 <= hour <= 9 or 17 <= hour <= 20):
                recommendations.append("Consider rescheduling to morning (6-9 AM) or evening (5-8 PM) time slots")
        recommendations.append("Bundle with popular classes or offer special promotions")
    
    result['recommendations'] = recommendations
    
    return result


