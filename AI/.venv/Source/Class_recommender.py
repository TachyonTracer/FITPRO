import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD


# function to check if the user is new or not
def is_new_user(user_id, user_item_matrix):
    return user_id not in user_item_matrix.index


# content based recommendation function for new user
def recommend_for_new_user(user_profile, class_data, df_cleaned, top_n=5):
    # Convert 'None' string to np.nan in user_profile for consistency
    user_profile = {key: (np.nan if value == 'None' else value) for key, value in user_profile.items()}

    # Filter out only relevant columns from df_cleaned for popularity
    popularity = (
        df_cleaned[df_cleaned['booking_status'] == 1]
        .groupby('class_id')
        .size()
        .reset_index(name='popularity')
        .sort_values(by='popularity', ascending=False)
    )

    # Merge popularity into class_data
    class_data = class_data.merge(popularity, on='class_id', how='left')
    class_data['popularity'] = class_data['popularity'].fillna(0)

    # Initial filtering based on demographics
    filtered = class_data.copy()

    # Optional filters based on what's available in user_profile
    if 'fitness_goal' in user_profile and pd.notna(user_profile['fitness_goal']):
        user_fitness_goal = str(user_profile['fitness_goal']).lower()
        filtered = filtered[filtered['fitness_goal'].str.lower() == user_fitness_goal]

    # Check if 'medical_condition' is present in the user profile and is not NaN
    if 'medical_condition' in user_profile and pd.notna(user_profile['medical_condition']):
        user_medical_condition = str(user_profile['medical_condition']).lower()

        # Handle if the user_profile medical_condition is 'none' or something else
        if user_medical_condition != 'none':  # Ensure it's not the 'None' string
            filtered = filtered[filtered['medical_condition'].str.lower() == user_medical_condition]

    # Sort by popularity
    filtered = filtered.sort_values(by='popularity', ascending=False)

    return filtered['class_id'].unique()[:top_n].tolist()


# Hybrid Recommendation function
def hybrid_recommendation(user_id, user_profile, user_item_matrix, class_data, df_cleaned, user_similarity_df, top_n=5):
    if is_new_user(user_id, user_item_matrix):
        print(f"User {user_id} is new. Using content-based filtering.")
        return recommend_for_new_user(user_profile, class_data, df_cleaned, top_n)
    
    # Otherwise, use collaborative filtering
    print(f"User {user_id} is existing. Using collaborative filtering.")
    
    # Get the user's vector
    if user_id not in user_similarity_df.index:
        print(f"User {user_id} not found in user-item matrix.")
        return []

    # Get similarity scores for this user with all others
    similar_users = user_similarity_df.loc[user_id].sort_values(ascending=False)
    
    # Exclude the user themselves
    similar_users = similar_users.drop(user_id)
    
    # Take top 5 similar users (can change)
    top_similar_users = similar_users.head(5).index

    # Get classes these similar users have booked
    class_scores = pd.Series(0, index=user_item_matrix.columns)
    for sim_user in top_similar_users:
        class_scores += user_item_matrix.loc[sim_user]
    
    # Get classes the target user has already booked
    booked_classes = user_item_matrix.loc[user_id]
    
    # Filter out classes already booked
    recommended_classes = class_scores[booked_classes == 0]
    
    # Sort and return top N
    return recommended_classes.sort_values(ascending=False).head(top_n).index.tolist()