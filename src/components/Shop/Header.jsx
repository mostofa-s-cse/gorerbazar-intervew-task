function Header({ data }) {
  return (
    <header className="pb-0 work-header section-padding">
      <div className="container mt-80">
        <div className="row">
          <div className="col-12">
            <div className="caption">
              <h6 className="sub-title">{data.subTitle}</h6>
              <h1 style={{ textAlign: "left" }}>{data.title}</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
