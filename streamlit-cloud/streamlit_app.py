import streamlit as st

st.set_page_config(
    page_title="ONPRINT",
    page_icon="🖨️",
    layout="centered",
)

st.title("ONPRINT")
st.write(
    "This Streamlit app is only a publish check. "
    "The live printing website is already hosted on GoDaddy."
)
st.link_button("Open 0nprint.com", "https://0nprint.com")
