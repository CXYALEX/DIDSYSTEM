<template>
  <div>
    <!-- section III -->
    <section class="middle-section">
      <h2 class="middle-title">What is PolyuDID? <br>Get started in minutes.</h2>
      <p class="middle-additional-description">
        PolyuDID is a state of the art decentralized identity infrastructure that provides comprehensive privacy-preserving solutions for Web3 applications. By leveraging zero-knowledge proofs and blockchain technology, it enables applications to implement robust digital identity features while ensuring user privacy and data sovereignty. The system supports essential privacy-preserving capabilities including selective disclosure of credentials, non-transferability of identity claims, unlinkability between transactions, and dynamic credential revocation. As an open-source middleware solution, PolyuDID can be seamlessly integrated into any Web3 application, providing developers with the tools and infrastructure needed to build privacy-first digital identity systems. The platform has demonstrated its practical value through successful implementations in anti-fraud systems and privacy-preserving academic credential verification, showcasing its potential to deliver secure, privacy-focused authentication across diverse Web3 use cases.
      </p>
      <el-row :gutter="20" class="middle-feature-row">
        <!-- Card 1 -->
          <el-card class="middle-card">
            <div class="middle-picture">
                <img src="@/assets/image/overview.svg" alt="KYC Icon" class="middle-card-icon-img" />
            </div>
            <div class="middle-card-content">
              <h3>Digital identity infrastructure</h3>
              <!-- <p>A set of open-source software and infrastructure for developers to include privacy-first identity management features into their applications.</p> -->
            </div>
          </el-card>
      </el-row>
    </section>
    <!-- Hero Section I -->
    <section class="hero-section">
      <h2 class="hero-title">Digital Trust in One Click</h2>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-refresh"></i>
            </div>
            <div class="card-content">
            <h3>Selective Disclosure</h3>
              <p>Enable selective disclosure of credentials, allowing users to prove their identity while revealing only necessary information. Minimize data exposure and liability.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 2 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-phone"></i>
            </div>
            <div class="card-content">
              <h3>Non-transferable & Unique</h3>
              <p>Ensure credentials cannot be transferred or misused, maintaining the integrity of digital identities through cryptographic binding to their rightful owners.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 3 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-open"></i>
            </div>
            <div class="card-content">
              <h3>Revoke with Confidence</h3>
              <p>Maintain control over issued credentials with powerful revocation mechanisms. Instantly update credential status across the entire ecosystem when needed.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 4 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-message"></i>
            </div>
            <div class="card-content">
              <h3>Perfect Privacy through Unlinkability</h3>
              <p>Protect user privacy with transactions that cannot be linked, preventing tracking and correlation across different services and interactions.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 5 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-help"></i>
            </div>
            <div class="card-content">
              <h3>Seamless Integration</h3>
              <p>Built for developers, by developers. Easy-to-use SDKs and comprehensive documentation make integration into any Web3 application effortless.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 6 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-lock"></i>
            </div>
            <div class="card-content">
              <h3>Trust at Scale</h3>
              <p>Join a growing ecosystem of trusted credential issuers and verifiers. Issue once, verify anywhere - all while maintaining the highest privacy standards.</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <!-- Section II -->
    <section class="hero-section">
      <h2 class="hero-title">Build your Application</h2>
      <p class="additional-description">
        Empower your solutions with privacy-first identity infrastructure. <br> PolyuDID's zero-knowledge proofs and BBS+ credentials let you integrate secure, user-centric verification.
      </p>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
      
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/newKYC.svg" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h3>KYC (Know your Customer)</h3>
              <p>Streamline compliance processes by enabling users to share verified identity attributes (age, residency) securely - reducing operational costs while enhancing privacy protection.</p>
            </div>
          </el-card>
        <!-- Card 2 -->
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/newDegree.svg" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h3>Academic Degree
                Verification</h3>
              <p>Enable instant degree verification through tamper-resistant digital credentials. Educational institutions can issue verified credentials that employers can trust, eliminating lengthy verification delays.</p>
            </div>
          </el-card>
        <!-- Card 3 -->
        <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/anti-fraud.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h3>Anti-fraud System</h3>
              <p>Prevent impersonation and fraudulent activities through secure identity verification. Real-time credential validation helps protect users and organizations from scams and unauthorized access attempts.</p>
            </div>
          </el-card>
        <!-- <swiper-slide>
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/age.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>Age Verification</h4>
              <p>Protect minors, ensure privacy, prevent fraud, and meet regulatory standards seamlessly across digital platforms.</p>
            </div>
          </el-card>
        </swiper-slide> -->

        <!-- Card 4 -->
        <!-- <swiper-slide>
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/nation.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>National ID</h4>
              <p>Digital identities made secure, private, and interoperable for seamless citizen services and global authentication.</p>
            </div>
          </el-card>
        </swiper-slide> -->
      </el-row>
    </section>
    
    <!-- section IV -->
  <section class="switch-section">  
    <h2 class="switch-title">
      Serve your audience, exclude the rest in two steps</h2>
      <p class="switch-additional-description">
      </p>
    <div class="switch-div">
    <!-- Buttons to switch content -->
      <button 
        :class="{'active': isSelected === 1}" 
        @click="switchTab(1)">
        1. Instant Identity Verification
      </button>
      <button 
        :class="{'active': isSelected === 2}" 
        @click="switchTab(2)">
        2. Reusable Anywhere
      </button>
    <transition name="fade" mode="out-in">
        <!-- Content that will be shown based on the selected button -->
      <div v-if="isSelected === 1" class="verification-container">
        <!-- Left side: Video section -->
        <div class="verification-video">
          <div class="video-frame-container">
            <iframe 
              class="video-frame" 
              src="https://www.youtube.com/embed/xya" 
              frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">1. Instant Identity Verification</h2>
          <p class="verification-text">
            Applications typically request user input directly, but when they need verifiable data, users must obtain that information from a trusted credential provider.
            <br>
          <br> Privado ID seamlessly guides users through credential acquisition, creating an identity wallet instantly if necessary. Verification takes place in-app, and may include Zero Knowledge proofs (generated on the user's device for privacy assurance) and data fields.
          <br>
          <br> User data is securely encrypted in the cloud and decrypted only on their end. Once complete, users return to the application.
          </p>
          
        </div>
      </div>

      <div v-if="isSelected === 2" class="verification-container">
        <!-- Left side: Video section -->
        <div class="verification-video">
          <div class="video-frame-container">
            <iframe 
              class="video-frame" 
              src="https://www.youtube.com/embed/xyz" 
              frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">2. Reusable Anywhere</h2>
          <p class="verification-text">
            The User can reuse the credentials obtained and stored in the Privado ID Cloud Wallet in other applications that use Privado ID as a verification mechanism - since there is no need to go through the issuance process again, this is a 2-click experience (authenticate & verify).
          </p>
          
        </div>
      </div>
    </transition>
  </div>
  </section>
  </div>
</template>

<script>


export default {
  name: "HomePage",
  
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  text-align: left;
  padding: 60px 20px;
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
  color: var(--text-dark);
  max-width: 1000px;
}

/* Feature Cards */
.feature-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.feature-card {
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-card:hover {
  transform: scale(1.05);
}

.card-icon {
  font-size: 24px;
  color: #081bec;
  /* margin-right: 10px;  Adjust margin between icon and text */
  align-self: flex-start; /* Ensure the icon aligns left */
  display: inline-block; /* Make sure icon is on the same line as text */
}

.card-content {
  /* display: flex; */
  flex-direction: column;
  justify-content: flex-start;
}

.card-content h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px; /* Reduced margin between h4 and text */
  text-align: center; /* Ensure the title is left-aligned */
}

.card-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  /*width: 300px;  Adjust max-width to ensure text does not go too wide */
  word-wrap: break-word;
  text-align: left;
}

/* Adjust spacing between cards */
.el-col {
  padding: 10px;
}
.additional-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-medium);
  max-width: 1500px;
  margin-bottom: 50px;
}

/* Adjust swiper-card width for each card to take up 50% of the row */
.swiper-row {
  display: flex;
  flex-wrap: wrap; /* Make sure the items wrap when needed */
  gap: 20px; /* Add some spacing between the cards */
  justify-content: space-between; /* Align the cards evenly */
}

.swiper-card {
  width: 30%; /* Ensure two cards per row */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: auto; /* Let the height adjust based on content */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align content at the top */
}

.swiper-card:hover {
  transform: scale(1.05);
}

.swiper-picture {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 可选：如果容器本身也需要固定高度 */
  height: 250px; /* 根据需求调整 */
}

.swiper-picture img {
  height: 250px; /* 固定高度 */
  width: auto; /* 宽度自适应保持比例 */
  object-fit: cover; /* 控制图片填充方式 */
}


/* Adjust icon image size */
.card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 300px; /* Set a max width for the image */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 10px;
}

/* section III */
.middle-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.middle-title {
  font-size: 3.25rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
}

.middle-additional-description {
  max-width: 900px;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0 auto 60px;
  text-align: center;
}

/* Styling for the middle feature row (card container) */
.middle-feature-row {
  display: flex;
  justify-content: center; /* Center the card within the row */
  flex-wrap: wrap; /* Ensure cards wrap on smaller screens */
  gap: 20px; /* Add space between the cards */
}

/* Card styles */
.middle-card {
  width: 1800px; /* Set the card width */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align the content to the top */
}

.middle-card:hover {
  transform: scale(1.05); /* Slight zoom effect on hover */
}

.middle-picture {
  display: flex;
  justify-content: center; /* Center the image inside the card */
  align-items: center; /* Center the image vertically */
  margin-bottom: 10px; /* Add space between the image and text */
}

.middle-card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 1850px; /* Optional: Set a max width to ensure the image doesn’t stretch too much */
  height: auto; /* Maintain the aspect ratio of the image */
}
.middle-card-content h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px; /* Reduced margin between h4 and text */
  text-align: left; /* Ensure the title is left-aligned */
}

.middle-card-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  /*width: 300px;  Adjust max-width to ensure text does not go too wide */
  word-wrap: break-word;
  text-align: left;
}

/* section IV */
.switch-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.switch-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 30px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.2;
}

.switch-additional-description {
  max-width: 700px;
  margin: 0 auto 40px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-medium);
}
.switch-div button {
  background: none;
  border: none;
  font-size: 18px;
  padding: 10px 20px;
  color: #B0B0B0; /* Default grey color */
  border-bottom: 2px solid transparent; /* Transparent bottom border */
  cursor: pointer;
  transition: all 0.1s ease;
}

.switch-div button.active {
  color: black; /* Black text when selected */
  font-weight: bold; /* Bold when selected */
  border-bottom: 2px solid #081bec; /* Green bottom border when selected */
}

.switch-div button:hover {
  opacity: 0.8; /* Slight opacity when hovering */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* div 1 */
.verification-container {
  padding: 60px 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.verification-video {
  width: 45%; /* Video section takes up 45% of the space */
  border: 5px solid #313ed1; /* Green border around the video */
  border-radius: 10px;
  padding: 10px;
}

.video-frame-container {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.video-frame {
  width: 100%;
  height: 400px; /* Fixed height for the video */
}

.verification-description {
  width: 50%; /* Description section takes up 50% */
  text-align: left;
}

.verification-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.verification-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}



/* Responsive */
@media (max-width: 768px) {
  .feature-card {
    height: auto;
  }
  .feature-row {
    flex-direction: column;
  }
  .middle-card {
    width: 100%; /* Ensure cards take full width on small screens */
  }
  .middle-feature-row {
    flex-direction: column; /* Stack the cards vertically on smaller screens */
  }
  .verification-video, .verification-description {
    width: 100%;
  }

  .video-frame {
    height: 200px; /* Adjust video height for small screens */
  }
}
</style>
<script>
export default {
  data() {
    return {
      isSelected: 1, // Default selected tab
    };
  },
  methods: {
    switchTab(tab) {
      this.isSelected = tab;
    }
  }
};
</script>