import styled from "styled-components";

export const MessageInputStylesProvider = styled.div`
  .form {
    display: flex;
    border-top: 2px solid #d3d3d3;
  }

  .input {
    border: none;
    border-radius: 0;
    padding: 5%;
    width: 80%;
    font-size: 1.2em;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }

  .sendButton {
    color: #fff !important;
    text-transform: uppercase;
    text-decoration: none;
    background: #075e54;
    padding: 20px;
    display: inline-block;
    border: none;
    width: 20%;
  }
`;
