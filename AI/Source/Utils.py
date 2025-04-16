import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

def load_data():
    return pd.read_csv('Data/class_recommendation_fitness_dataset.csv')


def preprocess():
    df = load_data()
    df_cleaned = df.drop_duplicates(subset=['user_id', 'class_id'])

    df_cf = df_cleaned[['user_id', 'class_id', 'booking_status']].drop_duplicates()
    user_item_matrix = df_cf.pivot(index='user_id', columns='class_id', values='booking_status').fillna(0)

    svd = TruncatedSVD(n_components=20, random_state=42)
    user_item_matrix_svd = svd.fit_transform(user_item_matrix)

    user_similarity = cosine_similarity(user_item_matrix_svd)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    return df_cleaned, user_item_matrix, user_similarity_df
