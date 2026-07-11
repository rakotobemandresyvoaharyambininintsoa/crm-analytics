import streamlit as st

def get_role():

    user = st.session_state.get(
        "user"
    )

    if user:

        return user["role"]

    return None





def has_permission(permission):


    role = get_role()



    permissions = {


        "admin":[
            "clients",
            "prospects",
            "ventes",
            "activites",
            "factures",
            "opportunites",
            "rapports"
        ],


        "sales":[
            "clients",
            "prospects",
            "ventes",
            "activites",
            "opportunites",
            "rapports"
        ],


        "viewer":[
            "clients",
            "prospects",
            "rapports"
        ]

    }



    return permission in permissions.get(
        role,
        []
    )