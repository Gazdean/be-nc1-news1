exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request invalid data type" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "article_id does not exist" });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  };
};
